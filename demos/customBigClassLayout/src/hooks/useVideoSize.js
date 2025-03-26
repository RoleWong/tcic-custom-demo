import { computed } from 'vue';
import { useElementSize } from '@vueuse/core';
export const useVideoSize = (containerRef, videoCountRef) => {
  const { width: containerWidth, height: containerHeight } = useElementSize(containerRef);
  const videoSize = computed(() => {
    if (videoCountRef.value === 1) {
      // 撑满高度
      return {
        videoWidth: (containerHeight.value) * 16 / 9,
        videoHeight: containerHeight.value,
      };
    }
    // 撑满宽度
    const videoWidth = containerWidth.value / videoCountRef.value;
    const videoHeight = videoWidth * 9 / 16;
    return {
      videoWidth,
      videoHeight,
    };
  });
  return videoSize;
};

