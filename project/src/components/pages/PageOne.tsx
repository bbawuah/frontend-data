import React, { useEffect, useState } from 'react'
import { AreaType, PaymentMethods } from '../../types/DataTypes'
import { Hello } from '../hello'
import Layout from '../layout/Layout'
// import {
//   DataType,
//   dirtyDataArrayType,
//   dirtyDataType,
//   formattedDataArayType
// } from '../../types/DataTypes'
// import jsonData from '../../data/Survey_Information_Design_clean-parsed.json'

const PageOne = () => {
  const [data, setData] = useState<any[]>([])
  // const arrayOfArrays = data.map((data: DataType) => {
  //   return Object.entries(data)
  // })

  // const arrayWithNumbers = arrayOfArrays.map(
  //   (arrayInArray: dirtyDataArrayType) => {
  //     const filteredArray = arrayInArray.filter((data) => {
  //       const num = parseInt(data[1])
  //       if (!isNaN(num)) {
  //         return data
  //       }
  //     })

  //     const convertedArray: formattedDataArayType = filteredArray.map(
  //       (data: dirtyDataType) => [data[0], parseInt(data[1])]
  //     )

  //     return convertedArray
  //   }
  // )

  useEffect(() => {
    ;(async () => {
      const res = await fetch('https://opendata.rdw.nl/resource/r3rs-ibz5.json')

      const json = await res.json()

      console.log(getPaymentMethods(json))

      const paymentMethods = Object.values(PaymentMethods)

      const formattedArray = paymentMethods.map((payment) =>
        json.filter(
          (item: AreaType) => item.paymentmethod.toUpperCase() === payment
        )
      )

      console.log(formattedArray)

      setData(data.concat(json))
      // console.log(json)
    })()
  }, [])

  return (
    <div>
      <Layout>
        <h1>Page one</h1>
        <Hello title="DataViz is cool" />
      </Layout>
    </div>
  )

  function getPaymentMethods(json: AreaType[]): Set<string> {
    const array = json.map((item: AreaType) => {
      return item.paymentmethod.toUpperCase()
    })

    return new Set(array)
  }
}

export default PageOne
