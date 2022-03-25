import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCoffee,
  faAddressBook,
  faAirFreshener,
  faAmbulance,
  faAtom,
  faBus,
  faCoins,

} from '@fortawesome/free-solid-svg-icons'

import { faGithub } from '@fortawesome/free-brands-svg-icons'

export default () => (
  <div className="bg-neutral-800">
    <div className="flex flex-col  bg-gray-800 text-black  font-bold w-1/4 h-screen ">
      <div className="flex justify-center py-10">

        <div className="w-40 h-40">

          <img className="mc_gravatar w-full h-full rounded-full " src="https://res.cloudinary.com/macorreag/image/upload/v1600868380/desk.jpg" alt="Italian Trulli"></img>
        </div>
      </div>
      <div className="flex w-full px-4">
        <div className="flex w-full bg-white p-6 rounded-lg items-center ">
          <FontAwesomeIcon icon={faCoffee} size="1x" />
          <FontAwesomeIcon icon={faGithub} size="1x" />

        </div>
      </div>

      sdfsdf
    </div>

    <div className="grid grid-cols-3 md:grid-cols-6">
      <div id="">1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>9</div>
    </div>
  </div>
)
