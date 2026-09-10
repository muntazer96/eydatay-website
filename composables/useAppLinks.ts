export function useAppLinks() {
  const config = useRuntimeConfig().public

  const androidPlayStoreUrl = config.androidPlayStoreUrl as string
  const iosAppStoreUrl = config.iosAppStoreUrl as string

  function downloadUrl(doctorId?: number | string): string {
    const url = new URL('/download', siteUrl())
    if (doctorId !== undefined && doctorId !== null && doctorId !== '') {
      url.searchParams.set('doctorId', String(doctorId))
    }
    return url.toString()
  }

  /** Attempts to open the installed mobile app; falls back to the download page. */
  function openAppDeepLink(doctorId?: number | string) {
    const fallback = downloadUrl(doctorId)
    const currentPath = doctorId ? `/d/${encodeURIComponent(String(doctorId))}` : '/'
    const intent =
      `intent://${window.location.host}${currentPath}` +
      `#Intent;scheme=${window.location.protocol.replace(':', '')};` +
      `package=${config.androidPackage as string};` +
      `S.browser_fallback_url=${encodeURIComponent(fallback)};end`
    window.location.href = intent
  }

  return {
    androidPlayStoreUrl,
    iosAppStoreUrl,
    androidPackage: config.androidPackage as string,
    downloadUrl,
    openAppDeepLink,
  }
}