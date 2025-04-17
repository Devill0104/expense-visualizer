import React from 'react'
import leetcode from '../assets/img/leetcode.svg'

const Footer = () => {
  let toggle = true;
    const handleOnclick = ()=>{
        
        if(toggle) {
          let icon  = document.getElementById("heart");
          icon.classList.add("fas")
          icon.classList.remove("far")
          toggle = false;
        }
        else {
          let icon  = document.getElementById("heart");
          icon.classList.add("far")
          icon.classList.remove("fas")
          toggle = true;
        }
        
    }
  return (
    <div className='footer-main'>
        
            <div className="footer-links">
                <span className='footer-link'><a href="https://www.linkedin.com/in/aditya-kumar-maurya-5a6954234/"><i className="fa-brands fa-linkedin"></i>LinkedIn</a></span>
                <span className='footer-link'><a href="https://github.com/Devill0104/"><i className="fa-brands fa-github"></i>Github</a></span>
                <span className='footer-link'><a href="https://leetcode.com/u/Aditya_Maurya_01/"><img src={leetcode} className="f-img" alt="" />Leetcode </a></span>
            </div>
            <div className="footer-p">
                <p>Made by Aditya</p>
            </div>
    </div>
  )
}

export default Footer