package clipto.api

import clipto.domain.Clip
import io.reactivex.Single
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface SyncApi {

    data class SyncResponse(
        val status: String,
        val version: Long,
        val data: List<Clip>? = null
    )

    data class PushRequest(
        val clips: List<Clip>
    )

    @GET("/sync")
    fun pull(@Query("version") clientVersion: Long): Single<SyncResponse>

    @POST("/sync")
    fun push(@Body request: PushRequest): Single<SyncResponse>
}
