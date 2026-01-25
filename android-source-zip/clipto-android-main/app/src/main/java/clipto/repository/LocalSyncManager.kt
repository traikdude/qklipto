package clipto.repository

import clipto.api.SyncApi
import clipto.dao.objectbox.ClipBoxDao
import clipto.domain.Clip
import io.reactivex.schedulers.Schedulers
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class LocalSyncManager @Inject constructor(
    private val clipBoxDao: ClipBoxDao,
    private val sharedPrefsState: clipto.dao.sharedprefs.SharedPrefsState
) {

    // Base URL is overridden by @Url params, but Retrofit needs a valid base.
    private val DUMMY_BASE_URL = "http://localhost/"

    private val api: SyncApi

    init {
        val logging = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }
        
        val client = OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(10, TimeUnit.SECONDS)
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl(DUMMY_BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create(clipto.common.misc.GsonUtils.get()))
            .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
            .build()

        api = retrofit.create(SyncApi::class.java)
    }

    private fun getSyncUrl(): String {
        val saved = sharedPrefsState.mainListData.getValue()?.serverAddress
        // Default to the user's requested hardcoded IP if nothing is saved
        val base = if (saved.isNullOrBlank()) "http://10.0.0.59:3000/" else saved
        return if (base.endsWith("/")) "${base}sync" else "$base/sync"
    }

    fun executePush() {
        // 1. Get all clips from local DB
        val allClips = clipBoxDao.getAllClips()
        // ClipBox implements Clip, so we can pass it directly or cast if needed
        val domainClips: List<Clip> = allClips

        val url = getSyncUrl()
        println("SYNC: Found ${domainClips.size} clips to push to $url")

        // 2. Push to Server
        api.push(url, SyncApi.PushRequest(domainClips))
            .subscribeOn(Schedulers.io())
            .subscribe({ response ->
                println("SYNC: Push Success! Server Version: ${response.version}")
            }, { error ->
                println("SYNC: Push Failed: ${error.message}")
                error.printStackTrace()
            })
    }

    fun executePull() {
        val url = getSyncUrl()
        println("SYNC: Pulling from $url")

        // 1. Ask Server for data (version 0 to get everything)
        api.pull(url, 0)
            .subscribeOn(Schedulers.io())
            .subscribe({ response ->
                println("SYNC: Pull Response: ${response.status}")
                response.data?.let { clips ->
                    println("SYNC: Received ${clips.size} clips.")
                    // 2. Save to DB
                    clips.forEach { clip ->
                        try {
                            clipBoxDao.createOrUpdate(clip, false)
                        } catch (e: Exception) {
                            println("SYNC: Failed to save clip ${clip.text?.take(20)}: ${e.message}")
                        }
                    }
                    println("SYNC: Import Complete.")
                }
            }, { error ->
                println("SYNC: Pull Failed: ${error.message}")
                error.printStackTrace()
            })
    }
}
