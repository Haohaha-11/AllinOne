import { useEffect, useCallback } from 'react';

interface ClipboardMonitorProps {
  onLinkDetected: (url: string) => void;
  enabled?: boolean;
}

const SUPPORTED_PATTERNS = [
  /mp\.weixin\.qq\.com/i,
  /zhihu\.com/i,
  /xiaohongshu\.com/i,
  /douyin\.com/i,
  /bilibili\.com/i,
];

export function ClipboardMonitor({ onLinkDetected, enabled = true }: ClipboardMonitorProps) {
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      if (!enabled) return;

      const text = event.clipboardData?.getData('text');
      if (!text) return;

      // 检查是否包含支持的平台链接
      const isSupported = SUPPORTED_PATTERNS.some((pattern) => pattern.test(text));
      if (isSupported) {
        onLinkDetected(text);
      }
    },
    [enabled, onLinkDetected]
  );

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return null; // 这是一个无UI的组件
}
