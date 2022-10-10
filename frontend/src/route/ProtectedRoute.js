import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ isAdmin, component: Component, ...routeProps }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user)

  if (!loading && isAuthenticated === false) {
    return <Navigate to='/login' replace />
  }

  if (!loading && isAdmin === true && user?.role !== 'admin') {
    return <Navigate to='/login' replace />
  }

  return (
    <Fragment>
      {loading === false ? <Component {...routeProps} /> : null}
    </Fragment>
  )
}
export default ProtectedRoute
