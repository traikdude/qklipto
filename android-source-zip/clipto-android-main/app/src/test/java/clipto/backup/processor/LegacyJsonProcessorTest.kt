package clipto.backup.processor

import android.content.ContentResolver
import android.net.Uri
import clipto.domain.Filter
import clipto.repository.IFilterRepository
import io.reactivex.Single
import org.junit.Assert
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.ArgumentMatchers
import org.mockito.Mockito
import org.mockito.junit.MockitoJUnitRunner
import java.io.ByteArrayInputStream

@RunWith(MockitoJUnitRunner::class)
class LegacyJsonProcessorTest {

    @Test
    fun testRestore() {
        // Mocks
        val contentResolver = Mockito.mock(ContentResolver::class.java)
        val uri = Mockito.mock(Uri::class.java)
        val repo = Mockito.mock(IFilterRepository::class.java)
        
        // Spy on default constructor
        val processor = Mockito.spy(LegacyJsonProcessor())
        
        // Mock getHelperFilterRepository to return our mock repo
        Mockito.doReturn(repo).`when`(processor).getHelperFilterRepository()

        val json = """
            {
              "source": "clipto",
              "version": "1.0",
              "clips": [
                {
                  "text": "Clip With Tags",
                  "tags": ["ExistingTag", "NewTag"]
                }
              ]
            }
        """.trimIndent()
        
        Mockito.doReturn(ByteArrayInputStream(json.toByteArray())).`when`(contentResolver).openInputStream(ArgumentMatchers.any())

        // 1. Existing Tag Logic
        val existingFilter = Mockito.mock(Filter::class.java)
        Mockito.doReturn("id_existing").`when`(existingFilter).uid
        Mockito.doReturn(existingFilter).`when`(processor).findTagByName("ExistingTag")

        // 2. New Tag Logic
        Mockito.doReturn(null).`when`(processor).findTagByName("NewTag")
        
        val newFilter = Mockito.mock(Filter::class.java)
        Mockito.doReturn("id_new").`when`(newFilter).uid
        
        Mockito.doReturn(Single.just(newFilter)).`when`(repo).save(ArgumentMatchers.any())

        // Execute
        val stats = processor.restore(contentResolver, uri)
        
        // Verify output
        Assert.assertEquals(1, stats.clips.size)
        val clip = stats.clips[0]
        Assert.assertEquals(2, clip.tagIds.size)
        Assert.assertTrue(clip.tagIds.contains("id_existing"))
        Assert.assertTrue(clip.tagIds.contains("id_new"))
        
        // Verify Repo Call for new tag
        Mockito.verify(repo).save(ArgumentMatchers.argThat { it.name == "NewTag" })
    }
}
