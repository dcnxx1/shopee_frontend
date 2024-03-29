import React,{useEffect, useState} from 'react'
import { makeId } from '../misc/makeid'
import axios from 'axios'
const public_location = 'https://shopee-backend.herokuapp.com'
function useBag() {
  
  const [bag, setBag] = useState([])
  const [showBag, setShowBag] = useState(false)

  
  function setItem() {
    window.localStorage.setItem('cart',JSON.stringify(bag))
  }

    function sameSize(itemObj){
      const getSizeReq = itemObj.size.map(obj => obj.selectedSize)
      const selectedSize = {}
      
      for (var size of getSizeReq){
        selectedSize.size = size.element 
      }
      return selectedSize
    }

    function changeAmount(e, item){
      const getAmount = e.target.value
     
      const newState = bag.map(obj => obj.model == item.model ? {...obj, amount : getAmount } : obj)
     
      setBag(newState)
    }

  function addToBag(itemObj){
    const itemExists = bag.some(obj => obj.model== itemObj.model)
    
    if(itemExists){  
      const sizeValue = sameSize(itemObj) //42, XS, M, 27x30
      bag.forEach((obj) => {
        obj.size.push({sizeId: makeId(3), element: sizeValue})
      })
      
  } else {
      setBag(prevValue => ([...prevValue, itemObj]))
    }
  }
 

  function deleteFromBag(itemModel){
    const returnLeftOver = bag.filter(obj => obj.model !== itemModel)
  
    setBag(returnLeftOver)
  }

  useEffect(() => {
    setItem()
  
  }, [bag])


  function generatePdf () {
    axios.get(`${public_location}/pdf`, {
      bag
    })
  }


  // export function 
  const bagOptions = {
    bag,
    addToBag,
    setBag,
    showBag,
    setShowBag,
    deleteFromBag,
    changeAmount,
    generatePdf
  }

  return bagOptions
}

export default useBag