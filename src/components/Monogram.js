import React from 'react'

const Monogram = (props) => {
  const nameArray = props.name.split(" ");
  const first = nameArray ? nameArray[0].charAt(0).toUpperCase(): '';
  const last = nameArray.length >= 2? nameArray[1].charAt(0).toUpperCase(): '';

  if (last!='')
    return (
      <div className="border rounded-circle bg-taz-blue text-white text-center d-flex align-items-center justify-content-center monogram">
        {first + last}
      </div>
    ) 
  else
    return (
      <div className="border rounded-circle bg-taz-blue text-white text-center d-flex align-items-center justify-content-center monogram">
        {first}
      </div>
    )   
}

export default Monogram