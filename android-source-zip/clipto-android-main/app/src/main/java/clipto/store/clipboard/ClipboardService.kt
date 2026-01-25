package clipto.store.clipboard

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import androidx.lifecycle.LifecycleService
import clipto.action.intent.IntentActionFactory
import clipto.common.logging.L
import clipto.config.IAppConfig
import clipto.store.app.AppState
import clipto.store.clipboard.notification.ClipboardNotificationManager
import com.wb.clipboard.R
import dagger.hilt.android.AndroidEntryPoint
import java.util.concurrent.atomic.AtomicBoolean
import javax.inject.Inject

@AndroidEntryPoint
class ClipboardService : LifecycleService() {

    @Inject
    lateinit var appState: AppState

    @Inject
    lateinit var appConfig: IAppConfig

    @Inject
    lateinit var clipboardState: ClipboardState

    @Inject
    lateinit var intentActionFactory: IntentActionFactory

    @Inject
    lateinit var clipboardStateManager: IClipboardStateManager

    @Inject
    lateinit var clipboardNotificationManager: ClipboardNotificationManager

    private val serviceStarted = AtomicBoolean(false)

    private val screenReceiver = lazy {
        object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                L.log(this@ClipboardService, "onReceive: {}", intent.action)
                when (intent.action) {
                    Intent.ACTION_SCREEN_OFF -> {
                        clipboardStateManager.onTrack(false)
                    }
                    Intent.ACTION_USER_PRESENT -> {
                        if (clipboardState.isClipboardActivated()) {
                            clipboardStateManager.onTrack(true)
                        }
                    }
                }
            }
        }
    }

    private fun registerService() {
        try {
            if (serviceStarted.compareAndSet(false, true)) {
                L.log(this, "registerService")
                try {
                    clipboardNotificationManager.notify(this)
                } catch (e: Throwable) {
                    L.log(this, "CRITICAL: Failed to start foreground service", e)
                    serviceStarted.set(false)
                    stopSelf()
                    return
                }
                
                try {
                    clipboardStateManager.onTrack(true)
                    registerScreenReceiver()
                } catch (e: Throwable) {
                    L.log(this, "Error initializing logic components", e)
                }
            }
        } catch (e: Throwable) {
            L.log(this, "registerService fatal error", e)
            serviceStarted.set(false)
            stopSelf()
        }
    }

    private fun unregisterService() {
        runCatching {
            if (serviceStarted.compareAndSet(true, false)) {
                L.log(this, "unregisterService")
                clipboardNotificationManager.cancel()
                clipboardStateManager.onTrack(false)
                unregisterScreenReceiver()
                stopForeground(true)
                stopSelf()
            }
        }
    }

    private fun registerScreenReceiver() {
        runCatching {
            if (appConfig.canPauseClipboardOnScreenLock() && !clipboardState.isClipboardSupportedNatively()) {
                applicationContext.registerReceiver(screenReceiver.value,
                    IntentFilter().apply {
                        addAction(Intent.ACTION_SCREEN_OFF)
                        addAction(Intent.ACTION_USER_PRESENT)
                    })
            }
        }
    }

    private fun unregisterScreenReceiver() {
        runCatching {
            if (screenReceiver.isInitialized()) {
                applicationContext.unregisterReceiver(screenReceiver.value)
            }
        }
    }

    override fun onCreate() {
        super.onCreate()

        registerService()

        clipboardState.notification.getLiveData().observe(this) {
            try {
                clipboardNotificationManager.notify(this, it?.clip)
            } catch (e: Throwable) {
                L.log(this, "Failed to update notification", e)
            }
        }

        var canTrackClipboardInitialValue = clipboardState.canTakeNoteFromClipboard.getValue()
        clipboardState.canTakeNoteFromClipboard.getLiveData().observe(this) {
            try {
                if (it != canTrackClipboardInitialValue) {
                    val toastRes = if (it) R.string.notification_track_clipboard_resume else R.string.notification_track_clipboard_pause
                    canTrackClipboardInitialValue = it
                    appState.showToast(toastRes)
                }
            } catch (e: Throwable) {
                L.log(this, "Failed to handle clipboard track change", e)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterService()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        registerService()
        runCatching { intent?.let { intentActionFactory.handle(this, it) } }
        return super.onStartCommand(intent, flags, startId)
    }

}