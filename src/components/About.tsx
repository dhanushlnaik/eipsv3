import React from 'react'
import { Button } from './ui/MovingBorders'


const About = () => {
  return (
       <div className="py-20 w-full">

    
          <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
  
                    <Button
                      //   random duration will be fun , I think , may be not
                      duration={Math.floor(Math.random() * 10000) + 10000}
                      borderRadius="1.75rem"
                      style={{
                        //   add these two
                        //   you can generate the color from here https://cssgradient.io/
                        background: "rgb(4,7,29)",
                        backgroundColor:
                          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                        // add this border radius to make it more rounded so that the moving border is more realistic
                        borderRadius: `calc(1.75rem* 0.96)`,
                      }}
                      // remove bg-white dark:bg-slate-900
                      className="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >

              <div className="p-40 lg:ms-5">
              <h1 className="heading pb-10">
            What is 
            <span className="text-purple"> EIPs Insights</span>
          </h1>
                <p className="text-start text-xl text-white-100 mt-3 font-semibold">
                EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of Ethereum Improvement Proposal (EIP), Ethereum Request for Comments (ERCs), and Rollup Improvement Proposals (RIPs), over a specified period. Data provided is used for tracking the progress and workload distribution among EIP Editors, ensuring transparency and efficiency in the proposal review process.
                </p>
              </div>
              </Button>
            </div>
        </div>
  )
}

export default About