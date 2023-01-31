import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// import ReactDOMServer from "react-dom/server";
import s from "./CategoriesMenu.module.scss";

export default function CategoriesMenu({ propCat }) {
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
    if (propCat !== undefined) {
        console.log("propCat work! --CategoriesMenu");
        setSelectedCategories(propCat);
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
  }, [propCat]);

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
                setSelectedCategories(propCat);
                setHasParent(false);
            }
        }
    }
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
              className={`${s[btn]} ${s["btn-green"]}`}
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
                  to={`?category=${category.name}`}
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
          <div className={`${s[spinner-border]} ${s[custom-color]}`} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </ul>
    </div>
  );
}