import { Component } from 'solid-js'
import '../css/background-star.scss'

export const BackgroundStar: Component = (props) => {
  return (
    <div class="background-star-container">
      <div class="background-star-sub-container">
        <div class="sky">
          <div class="stars"></div>
          <div class="stars2"></div>
          <div class="stars3"></div>
          <div class="comet"></div>
        </div>
      </div>
    </div>
  )
}
