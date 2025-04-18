<template>
  <div class="camera-sub-component">
    <el-tooltip
      class="item"
      :disabled="(isMobile && !btnDisabled) || localComponent.active"
      :content="!isClassStarted ? translateTip.roomStartContent
        : (!isOnStage ? $t('请先上台再切换摄像头') : $t('摄像头'))"
    >
      <el-popover
        ref="camera-setting-popover"
        placement="bottom"
        width="300"
        trigger="manual"
        :visible-arrow="true"
        popper-class="header-camera-popover"
        @show="onShow"
      >
        <div>
          <div class="text-lable">
            {{ $t('摄像头') }}
          </div>
          <el-select
            v-model="selectCameraId"
            :placeholder="$t('请选择')"
            :popper-append-to-body="false"
            @change="onCameraChange"
          >
            <el-option
              v-for="item in cameras"
              :key="item.deviceId"
              :label="item.label"
              :value="item.deviceId"
            />
          </el-select>
        </div>
        <video
          id="preview-video"
          autoplay
        />

        <button
          slot="reference"
          :ref="localComponent.name"
          :disabled="btnDisabled"
          class="header__button button--secondary"
          :class="{ active: localComponent.active }"
          @click="onButtonClick"
        >
          <div class="tool-item-wrap">
            <el-badge
              :value="localComponent.badge"
              :max="99"
              class="badge"
              :hidden="localComponent.badge === 0"
            >
              <i :class="['header__i', 'i--menu', cameraOn ? 'icon-camera-setiing' : 'icon-camera-off']" />
            </el-badge>
            <span class="header__btn-text">{{ $t('摄像头') }}</span>
            <i class="el-icon-caret-bottom downicon" />
          </div>
        </button>
      </el-popover>
    </el-tooltip>
  </div>
</template>


<script>
import Constant from '@/util/Constant';
import i18next from 'i18next';
import DeviceUtil from '@/util/DeviceUtil';
export default {
    name: 'CameraSubComponent',
    props: {
        component: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            localComponent: this.component,
            isMobile: TCIC.SDK.instance.isMobile(),
            isClassStarted: false,
            cameras: [],
            cameraOn: false,
            selectCameraId: '',
          isOnStage: false,
          roomInfo: {},
          roleInfo: {},
        };
    },
    computed: {
      btnDisabled() {
        return !this.isClassStarted || !this.isOnStage;
      },
      translateTip() {
        return {
          roomStartContent: i18next.t('开始{{arg_0}}后才可切换摄像头', { arg_0: this.roomInfo.startRoom }),
        };
      },
    },
    watch: {},
    mounted() {
        this.updateStatus();
        this.addLifecycleTCICStateListener(TCIC.TMainState.Class_Status, (status) => {
            this.updateStatus();
        });
        this.addLifecycleTCICStateListener(Constant.TStateImmerseMode, this.onImmerseModeChange);
        this.getDevice();

      this.addLifecycleTCICEventListener(Constant.TStateLoadingCameraState, ({ userId, type, value }) => {
        if (userId !== TCIC.SDK.instance.getUserId()) {
          return;
        }
        if (type === 'loadingOwnCamera') {
          if (typeof value.open === 'boolean') {
            const deviceStatus = TCIC.SDK.instance.getState(TCIC.TMainState.Video_Device_Status);
            // eslint-disable-next-line vue/no-mutating-props, no-nested-ternary
            this.cameraOn = !!value.open;
          }
        }
      });

      this.isOnStage = TCIC.SDK.instance.getState(TCIC.TMainState.Stage_Status, false);
      this.addLifecycleTCICStateListener(TCIC.TMainState.Stage_Status, (status) => {
        this.isOnStage = status;
      });
    },
    methods: {
      toggleCamera() {
        if (this.cameraOn) {
          DeviceUtil.toggleLocalDeviceWithLoadingEvent(
              'camera',
              false,
              () => TCIC.SDK.instance.stopLocalVideo(),
              {
                caller: 'Header',
                reason: 'enableCamera-false',
                reportAction: 'stopLocalVideo',
              },
          );
        } else {
          const currentVideoComponent = document.getElementById(`video-${TCIC.SDK.instance.getUserId()}`);
          if (currentVideoComponent) {
            DeviceUtil.toggleLocalDeviceWithLoadingEvent(
                'camera',
                true,
                () => TCIC.SDK.instance.startLocalVideo(currentVideoComponent),
                {
                  caller: 'Header',
                  reason: 'enableCamera-true',
                  reportAction: 'startLocalVideo',
                },
            );
          }
        }
      },
      onButtonClick(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        const arrowWidth = 16;
        if (clickX > rect.width - arrowWidth) {
          this.$refs['camera-setting-popover'].doToggle();
        } else {
          this.toggleCamera();
        }
      },
        async onCameraChange() {
            await TCIC.SDK.instance.getInstances().trtc.switchCamera(this.selectCameraId);
            this.getVideo();
        },
        getVideo() {
            const deviceId = this.selectCameraId;
            const constraints = {
                video: { deviceId: deviceId ? { exact: deviceId } : undefined },
                audio: false, // 如果需要麦克风，可以设置为 true 或指定设备 ID
            };
            const video = document.getElementById('preview-video');
            // 获取用户摄像头视频流
            navigator.mediaDevices.getUserMedia(constraints)
                .then((stream) => {
                    video.srcObject = stream;
                })
                .catch((error) => {
                });
        },
        getDevice() {
            TCIC.SDK.instance.getInstances().trtc._getDevices().then(async (devices) => {
                const tempCamera = [];
                const usedCameraId = await TCIC.SDK.instance.getInstances().trtc.getCameraDeviceId();
                for (let index = 0; index < devices.length; index++) {
                    const device = devices[index];
                    if (device.kind == 'videoinput') {
                        tempCamera.push(device);
                    }
                }
                this.cameras = tempCamera;
                this.selectCameraId = usedCameraId;
            });
        },
        onImmerseModeChange(hide) {
            if (hide) {
                this.$refs['camera-setting-popover'].doClose();
            }
        },
        onShow() {
            this.getDevice();
            this.getVideo();
        },
        updateStatus() {
            const classStatus = TCIC.SDK.instance.getState(TCIC.TMainState.Class_Status, TCIC.TClassStatus.Not_Start);
            this.isClassStarted = (classStatus === TCIC.TClassStatus.Already_Start);
        },
    },
};
</script>
<style lang="less">
.camera-sub-component {
  .icon-camera-setiing {
    background-image: url('../assets/icon-camera.svg');
  }
  .icon-camera-off {
    background-image: url('../assets/icon-camera-off.svg');
  }
  .tool-item-wrap {
    position: relative;
    .downicon {
      position: absolute;
      right: 2px;
      top: 50%;
      margin-top: -10px;
    }
  }
}

.header-camera-popover {
    .text-lable {
        margin-bottom: 10px;
        font-size: 12px;
    }

    .el-select {
        flex: 1;
        border: none;
        width: 100%;
        background: rgba(255, 255, 255, 0.08);
        .el-input__inner {
            background: transparent;
            border-radius: 0;
            border: 0;
            color: #fff;
        }

        &>.el-input {
            border: none;
        }

    }
    #preview-video {
        width: 100%;
        margin-top: 10px;
    }
}
</style>
