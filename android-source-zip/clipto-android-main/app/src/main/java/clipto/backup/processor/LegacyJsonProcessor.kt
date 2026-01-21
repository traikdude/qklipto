package clipto.backup.processor

import android.content.ContentResolver
import android.net.Uri
import clipto.backup.BackupItemType
import clipto.backup.BackupProcessor
import clipto.backup.IBackupProcessor
import clipto.domain.Clip
import clipto.domain.TextType
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.*
import javax.inject.Inject

class LegacyJsonProcessor @Inject constructor() : BackupProcessor() {

    override fun restore(contentResolver: ContentResolver, uri: Uri): IBackupProcessor.BackupStats {
        val restoredClips = mutableListOf<Clip>()
        var foundVersion = ""

        try {
            contentResolver.openInputStream(uri)?.use { inputStream ->
                val reader = BufferedReader(InputStreamReader(inputStream))
                val sb = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    sb.append(line)
                }
                
                // Parse JSON
                val root = JSONObject(sb.toString())
                
                // Check signature
                if (root.has("source") && root.getString("source").contains("clipto")) {
                     foundVersion = root.optString("version", "unknown")
                } else if (root.has("clips") && root.has("tags")) {
                    // Implicit check for our export format
                } else {
                    // Not our file
                    return IBackupProcessor.BackupStats()
                }

                val clipsArray = root.optJSONArray("clips") ?: return IBackupProcessor.BackupStats()
                
                for (i in 0 until clipsArray.length()) {
                    val item = clipsArray.getJSONObject(i)
                    val clip = Clip()
                    
                    // Map Fields
                    // ID mapping: Windows uses Strings (UUIDs?), Android uses Longs (localId) + String (firestoreId)
                    // We generate a new ID or leave it 0 to let ObjectBox assign one
                    // We map the Windows ID to firestoreId to preserve uniqueness if needed?
                    // Actually, let's just create new Clips.
                    
                    clip.text = item.optString("text", "")
                    clip.title = item.optString("title", null)
                    
                    // Dates - JSON Date() is usually ISO string "2023-..."
                    // We need to parse it. Or our export used .toISOString()
                    // If export was raw IDB, it might be string or object.
                    // Our Native Export uses .toISOString()
                    clip.createDate = parseDate(item.optString("createDate", null))
                    clip.modifyDate = parseDate(item.optString("modifyDate", null))
                    
                    clip.fav = item.optBoolean("fav", false)
                    
                    // Tags - Complex mapping. 
                    // Windows: ["tag1", "tag2"]
                    // Android: Needs tagIds.
                    // We currently skip tag linking to keep it simple, or store raw tags in a text field
                    // clip.tags = item.optString("tags", "") 
                    
                    restoredClips.add(clip)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            // Not a JSON file or error parsing
            return IBackupProcessor.BackupStats()
        }

        return IBackupProcessor.BackupStats(
            notes = restoredClips.size,
            clips = restoredClips
        )
    }

    private fun parseDate(dateStr: String?): Date? {
        if (dateStr.isNullOrEmpty()) return Date()
        try {
            // ISO 8601 parser
            return java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).parse(dateStr)
        } catch (e: Exception) {
            return Date()
        }
    }
}
