import { useHistory, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export const useScrollToTop = () => {
  const location = useLocation()
  const { pathname } = location
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
