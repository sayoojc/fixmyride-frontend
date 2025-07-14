import React from 'react'

  interface CategoryBarProps {
    setSelectedServiceCategory:(state:string) => void
    serviceCategories:{
      key:string,
      name:string,
      icon:string,
      isActive:boolean
    }[]
    selectedServiceCategory:string
  }
export const CategoryBar:React.FC<CategoryBarProps> = ({setSelectedServiceCategory,serviceCategories,selectedServiceCategory}) => {

  return (
     <div className="border-b">
      <div className="container mx-auto overflow-x-auto whitespace-nowrap px-4">
        <div className="flex space-x-8 py-4">
          {serviceCategories.map((category) => {
            const isActive = category.key === selectedServiceCategory;
            return (
              <div
                onClick={() => setSelectedServiceCategory(category.key)}
                key={category.key}
                className={`flex flex-col items-center cursor-pointer min-w-max ${
                  isActive ? "border-b-2 border-red-500" : ""
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <span className={`text-sm ${isActive ? "font-semibold" : ""}`}>
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
