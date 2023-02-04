import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import CategoriesContext from "../../contexts/Categories.context";
import { Category } from "../../classes/Category";
// import ReactDOMServer from "react-dom/server";
import s from "./CategoriesMenu.module.scss";

export default function CategoriesMenu() {

  const emptyValue = "00000000-0000-0000-0000-000000000000";
  const { allCategories } = useContext(CategoriesContext);
  const [categoriesView, setCategoriesView] = useState(undefined);
  const [selectedCategories, setSelectedCategories] = useState(undefined);
  const [hasParent, setHasParent] = useState(false);
  const [change, setChange] = useState(true);

  // function GenerateCategoriesMenu(arrayCategories){
  //     let menu = [];
  //     console.log(arrayCategories);
  //     if (arrayCategories !== undefined) {
  //         console.log("Joined");
  //         for(let category of arrayCategories){
  //             menu.push(<li>
  //             <NavLink to={`/${category.name}`} className={"navlink"}>
  //                 <img src={category.thumbnail} className={"thumbnail"} />
  //                 <span className="category-name">
  //                     {category.name}
  //                 </span>
  //                 <span className="count">(1029)</span>
  //             </NavLink>
  //         </li>);
  //             // menu += `<li>
  //             //     <NavLink to={"/${category.name}"} className={"navlink"}>
  //             //         <img src={${category.thumbnail}} className={"thumbnail"} />
  //             //         <span className="category-name">
  //             //             ${category.name}
  //             //         </span>
  //             //         <span className="count">(1029)</span>
  //             //     </NavLink>
  //             // </li>`;
  //         }
  //     }
  //     console.log(menu);
  //     console.log(<div><ul></ul><ul></ul></div>);
  //     return menu;
  // }

  useEffect(() => {
    if (allCategories !== undefined) {
        const result = GenerateCategoriesView(allCategories);
        setCategoriesView(result);
        setSelectedCategories(result);
    }
    // console.log("Use");
    // console.log(selectedCategories);
    // if (selectedCategories !== undefined) {
    //     console.log("Effect")
    //     if (change === true) {
    //         setChange(false);
    //         console.log(selectedCategories);
    //         // setCategoriesView(GenerateCategoriesMenu(selectedCategories));
    //         console.log(categoriesView);
    //     }
    // }
  }, [allCategories]);

  function openCategorie(category) {
    if (category.children?.length > 0) {
      setSelectedCategories(category.children);
      setHasParent(true);
    }
  }

  function back(){
    if (hasParent === true) {
        if (selectedCategories[0].parent != null) {
            let parentChildren = selectedCategories[0].parent.parent?.children;
            if (parentChildren != null) {
                setSelectedCategories(parentChildren);
            }
            else{
                setSelectedCategories(categoriesView);
                setHasParent(false);
            }
        }
    }
  }

  function GenerateCategoriesView(categories) {
    return GetAllCategories(emptyValue, [...categories.mainCategories], [...categories.subCategories]);
  }
  
  function GetAllCategories(parentId, mainCategories, subCategories) {
    let result = [];
    let category;
    for(let i = 0; i < mainCategories.length;){
      
      if (mainCategories[i].parentId == parentId) {
            category = new Category(mainCategories[i].id, mainCategories[i].name);
            mainCategories.splice(i, 1);
            category.addChildren(GetAllCategories(category.id, mainCategories, subCategories));
            result.push(category);
            i=0;
            continue;
        }
  
        i++;
    }
    for(let i = 0; i < subCategories.length; ){
        if (subCategories[i].parentId == parentId) {
            category = new Category(subCategories[i].id, subCategories[i].name, subCategories[i].thumbnail);
            subCategories.splice(i, 1);
            result.push(category);
            continue;
        }
        
        i++;
    }
    return result;
  }

  return (
    <div>
      {/* <ul id="CategoriesMenu" dangerouslySetInnerHTML={{__html: ReactDOMServer. categoriesView}}></ul> */}
      {/* <ul id="CategoriesMenu" >{categoriesView}</ul> */}

      <ul className={s["categories-menu"]}>
        {hasParent === true ? (
            <div>
          <li key={"comp-parent"} className="d-flex justify-content-between">
            <button
              className={`btn ${s["btn"]} ${s["btn-green"]}`}
              onClick={back}
            >
              <span className="">Back</span>
            </button>
          </li>
            <hr style={{margin: "5px"}} />
            </div>
        ) : (
          <></>
        )}
        {selectedCategories !== undefined ? (
          selectedCategories?.map((category) => {
            return (
              <li key={category.id} className="d-flex justify-content-between">
                <NavLink
                  replace={false}
                  to={`?category=${category.id}`}
                  className={`${s["navlink"]} d-flex`}
                  >
                    {category.children?.length <= 0 ? (
                        <span className="d-flex align-items-center align-content-start" style={{marginRight: "7px"}}>
                            <i className={s["arrow-right"]}></i>
                        </span>
                    ) : (
                      <></>
                    )}
                  <img src={category.thumbnail} className={"thumbnail"} />
                  <span className={s["category-name"]}>{category.name}</span>
                </NavLink>
                {category.children?.length > 0 ? (
                  <button
                    onClick={() => {
                      openCategorie(category);
                    }}
                    className={`d-flex me-1 ps-2 align-items-center align-content-end border-0 bg-transparent ${s["btn-arrow"]}`}
                  >
                    <i className={s["arrow-right"]}></i>
                  </button>
                ) : (
                  <></>
                )}
              </li>
            );
          })
        ) : (
          <div className={`${s["spinner-border"]} ${s["custom-color"]}`} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {/* {selectedCategories.length === 0 && <div className="text-center">Empty</div>} */}
      </ul>
    </div>
  );
}