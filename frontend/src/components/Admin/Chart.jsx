import './chart.css'
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

export default function Chart({
  title = 'Monthly Income',
  data,
  dataKey = 'Sales',
  grid,
}) {
  const MONTHS = useMemo(
    () => [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    []
  )
  const [pStats, setPStats] = useState([])
  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get('/api/v2/admin/orders/income')
        const list = res.data.sort((a, b) => {
          return a._id - b._id
        })
        list.map((item) =>
          setPStats((prev) => {
            return [...prev, { name: MONTHS[item._id - 1], Sales: item.total }]
          })
        )
      } catch (error) {
        console.log(error)
      }
    }
    getStats()
    return () => {}
  }, [MONTHS])
  return (
    <div className='chart'>
      <h3 className='chartTitle'>{title}</h3>
      <ResponsiveContainer width='100%' aspect={4 / 1}>
        <LineChart data={pStats}>
          <XAxis dataKey='name' stroke='#847fe0' />
          <Line type='monotone' dataKey={dataKey} stroke='#171718' />
          <Tooltip />
          {grid && <CartesianGrid stroke='#e0dfdf' strokeDasharray='5 5' />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
