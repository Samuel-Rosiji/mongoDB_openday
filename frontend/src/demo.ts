/** Presentation mode: hide dev hints in the UI. */
export function isDemoMode(): boolean {
  return import.meta.env.VITE_DEMO === 'true'
}
