import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

/** Leaflet mis-measures tile layer when the map container size changes. */
export function MapResize({ watch }: { watch: unknown }) {
  const map = useMap()

  useEffect(() => {
    const run = () => map.invalidateSize({ animate: false })
    run()
    const id = window.requestAnimationFrame(run)
    const t = window.setTimeout(run, 200)
    return () => {
      window.cancelAnimationFrame(id)
      window.clearTimeout(t)
    }
  }, [map, watch])

  useEffect(() => {
    const onResize = () => map.invalidateSize({ animate: false })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [map])

  return null
}
