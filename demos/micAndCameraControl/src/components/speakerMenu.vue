<template>
  <div class="speaker-sub-component">
    <el-tooltip
      class="item"
      :disabled="(isMobile && !btnDisabled) || localComponent.active"
      :content="!isClassStarted ? translateTip.roomStartContent
        : (!isOnStage ? $t('请先上台再切换麦克风') : $t('麦克风'))"
    >
      <el-popover
        ref="camera-setting-popover"
        placement="bottom"
        width="300"
        trigger="manual"
        :visible-arrow="true"
        popper-class="header-speaker-popover"
        @show="onShow"
      >
        <div style="margin-bottom: 10px;">
          <div class="text-lable">
            {{ $t('麦克风') }}
          </div>
          <el-select
            v-model="selectMicId"
            :placeholder="$t('请选择')"
            :popper-append-to-body="false"
            @change="onMicsChange"
          >
            <el-option
              v-for="item in mics"
              :key="item.deviceId"
              :label="item.label"
              :value="item.deviceId"
            />
          </el-select>
        </div>
        <div>
          <div class="text-lable">
            {{ $t('输出') }}
          </div>
          <div class="volume">
            <div class="mic-icon" />
            <ul class="capacity">
              <li
                v-for="item in 21"
                :key="item"
                class="item"
                :class="{active: item < volumeLevel }"
              />
            </ul>
          </div>
        </div>
        <div>
          <div class="text-lable">
            {{ $t('扬声器') }}
          </div>
          <el-select
            v-model="selectSpeakerId"
            :placeholder="$t('请选择')"
            :popper-append-to-body="false"
            @change="onSpeakerChange"
          >
            <el-option
              v-for="item in speakers"
              :key="item.deviceId"
              :label="item.label"
              :value="item.deviceId"
            />
          </el-select>
        </div>
        <button
          slot="reference"
          :ref="localComponent.name"
          :disabled="btnDisabled"
          class="header__button button--secondary"
          :class="{ active: localComponent.active }"
          @click="showSpeakerSetting"
        >
          <div class="tool-item-wrap">
            <el-badge
              :value="localComponent.badge"
              :max="99"
              class="badge"
              :hidden="localComponent.badge === 0"
            >
              <i :class="['header__i', 'i--menu', micOn ? 'icon-speaker-setiing' : 'icon-speaker-setiing-off']" />
            </el-badge>
            <span class="header__btn-text">{{ $t('麦克风') }}</span>
            <i class="el-icon-caret-bottom downicon" />
          </div>
        </button>
      </el-popover>
    </el-tooltip>
  </div>
</template>
<script>
import BaseComponent from '@core/BaseComponent';
import Constant from '@/util/Constant';
import Lodash from 'lodash';
import Media from '@/util/Media';
import i18next from "i18next";
export default {
    name: 'SpeakerSubComponent',
    extends: BaseComponent,
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
            speakers: [],
            mics: [],
            selectSpeakerId: '',
            selectMicId: '',
            volumeLevel: 0,
            micOn: false,
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
          roomStartContent: i18next.t('开始{{arg_0}}后才可切换麦克风', { arg_0: this.roomInfo.startRoom }),
        };
      },
    },
    mounted() {
        const { roleInfo, roomInfo } = TCIC.SDK.instance.getRoleInfo();
        this.roleInfo = roleInfo;
        this.roomInfo = roomInfo;
        this.updateStatus();
        this.addLifecycleTCICStateListener(TCIC.TMainState.Class_Status, (status) => {
            this.updateStatus();
        });
        this.addLifecycleTCICStateListener(Constant.TStateImmerseMode, this.onImmerseModeChange);
        this.addLifecycleTCICEventListener(TCIC.TTrtcEvent.Volume_Update, (result) => {
        // 先过滤id，避免因防抖导致音量不展示
        if (result && result.userId === TCIC.SDK.instance.getUserId()) {
          this.volumeUpdateListener(result);
        }
      });
        this.getDevice();

      this.addLifecycleTCICEventListener(Constant.TStateLoadingMicState,  ({ userId, type, value }) => {
        if (userId !== TCIC.SDK.instance.getUserId()) {
          return;
        }
        if (type === 'loadingOwnMic') {
          if (typeof value.open === 'boolean') {
            const deviceStatus = TCIC.SDK.instance.getState(TCIC.TMainState.Audio_Device_Status);
            // eslint-disable-next-line vue/no-mutating-props, no-nested-ternary
            this.micOn = !!value.open;
          }
        }
      });

      this.isOnStage = TCIC.SDK.instance.getState(TCIC.TMainState.Stage_Status, false);
      this.addLifecycleTCICStateListener(TCIC.TMainState.Stage_Status, (status) => {
        this.isOnStage = status;
      });
    },
    methods: {
        volumeUpdateListener: Lodash.debounce(function (result) {
            this.volumeLevel = Media.amplifier(result.volume, 22);
        }, 50),
        async onMicsChange() {
            await TCIC.SDK.instance.getInstances().trtc.switchMic(this.selectMicId);
        },
        async onSpeakerChange() {
            await TCIC.SDK.instance.getInstances().trtc.switchSpeaker(this.selectSpeakerId);
        },
        getDevice() {
            TCIC.SDK.instance.getInstances().trtc._getDevices().then(async (devices) => {
                const tempSpeakers = [];
                const tempMics = [];
                const usedMicId = await TCIC.SDK.instance.getInstances().trtc.getMicDeviceId();
                const usedSpealerId = await TCIC.SDK.instance.getInstances().trtc.getSpeakerDeviceId();
                for (let index = 0; index < devices.length; index++) {
                    const device = devices[index];
                    if (device.kind == 'audiooutput') {
                        tempSpeakers.push(device);
                    }
                    if (device.kind == 'audioinput') {
                        tempMics.push(device);
                    }
                }
                this.speakers = tempSpeakers;
                this.mics = tempMics;
                this.selectSpeakerId = usedSpealerId;
                this.selectMicId = usedMicId;
            });
        },
        updateStatus() {
            const classStatus = TCIC.SDK.instance.getState(TCIC.TMainState.Class_Status, TCIC.TClassStatus.Not_Start);
            this.isClassStarted = (classStatus === TCIC.TClassStatus.Already_Start);
        },
        showSpeakerSetting(e) {
          const button = e.currentTarget;
          const rect = button.getBoundingClientRect();
          const clickX = e.clientX - rect.left;

          const arrowWidth = 16;
          if (clickX > rect.width - arrowWidth) {
            this.$refs['camera-setting-popover'].doToggle();
          } else {
            this.toggleMic();
          }
        },
      toggleMic() {
        TCIC.SDK.instance.muteLocalAudio(this.micOn);
      },
        onShow() {
            this.getDevice();
        },
        onImmerseModeChange(hide) {
            if (hide) {
                this.$refs['camera-setting-popover'].doClose();
            }
        },
    },
};
</script>
<style lang="less">
@import "../../device-detect-component/theme/college-web.less";
@import "../../device-detect-component/theme/college-electron.less";
.speaker-sub-component {
    .icon-speaker-setiing {
        background-image: url('../assets/icon-speaker.svg');
    }
  .icon-speaker-setiing-off {
    background-image: url('../assets/icon-speaker-off.svg');
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
.header-speaker-popover {
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
    .volume {
      display: flex;
      flex-wrap: nowrap;
      padding-top: 4px;
      height: 29px;
      margin-bottom: 10px;
      &.disabled {
        opacity: .4;
      }

      .mic-icon {
        width: 16px;
        background: no-repeat center center / 100% auto url('../../device-detect-component/assets/microphone-outline.png');
      }

      .mic-volume-value {
        width: 35px;
        line-height: 16px;
        font-weight: bolder;
        color: var(--main-text-color, #fff);
        text-align: center;
      }

      .speaker-icon {
        cursor: pointer;
        width: 16px;
        background: no-repeat center center / 100% auto url('../../device-detect-component/assets/speaker-outline.png');
        &.disable {
          background: no-repeat center center / 100% auto url('../../device-detect-component/assets/speaker-off.png');
        }
      }

      .capacity {
        position: relative;
        flex-grow: 1;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 0 4px 0 13px;
        margin-right: 37px;

        .slider-wrapper {
          display: block;
          width: 100%;
          height: 100%;
        }

        .item {
          width: 4px;
          height: 100%;
          border-radius: 2px;
          background: #D8D8D8;
          justify-content: space-between;

          &.active {
            background: #4880FF;
          }
        }
      }
    }
}

</style>
