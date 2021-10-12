import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Dashboard from './Dashboard'
import { AppState } from '../../../redux/types'

function AdminPage() {
  const isAdmin = useSelector((state: AppState) => state.auth.userData.isAdmin)

  if (!isAdmin) {
    alert('You do not have access to this page')
    return <Redirect to="/home" />
  }
  return (
    <div>
      <Dashboard />
    </div>
  )
}

export default AdminPage
