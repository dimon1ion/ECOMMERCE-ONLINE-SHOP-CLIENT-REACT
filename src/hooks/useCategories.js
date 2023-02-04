import { useEffect, useState } from "react";
import ServerPath from "../enums/ServerPath";
import getRequest from "../requests/getRequest";

export default function useCategories(props) {
  const [allCategories, setAllCategories] = useState(undefined);
  const [allCategoriesSelectType, setAllCategoriesSelectType] =
    useState(undefined);

  useEffect(() => {
    checkCategories();
  }, []);

  const checkCategories = async () => {
    if (allCategories !== undefined && allCategoriesSelectType !== undefined) {
      return true;
    }
    // let result = await CategoriesLoad(serverPath + getAllCategoriesPath);
    const response = await getRequest(
      ServerPath.SERVERPATH + ServerPath.GETALLCATEGORIES
    );
    if (response === null || !response.ok) {
      // console.log("error");
      return false;
    }
    const data = await response.json();
    setAllCategories(data);
    const selectType = generateArrayForSelect([data.mainCategories, data.subCategories]);
    setAllCategoriesSelectType(selectType);
    return true;
  };

  const generateArrayForSelect = (values) => {
    const newArray = [];
    for (let array of values) {
      if (!Array.isArray(array)) {
        break;
      }
      array.forEach((item) => {
        newArray.push({ value: item.id, label: item.name });
      });
    }
    return newArray;
  };

  const getAllCategories = async () => {
    if (allCategories === undefined) {
        await checkCategories();
    }
    return allCategories;
  }

  const getAllCategoriesSelectType = async () => {
    if (allCategoriesSelectType === undefined) {
        if(await checkCategories() === false){
            // console.log("error");
            return undefined;
        }
    }
    return allCategoriesSelectType;
  }



  const clearCategories = () => {
    setAllCategories(undefined);
    setAllCategoriesSelectType(undefined);
    checkCategories();
  };

  return { allCategories, allCategoriesSelectType, checkCategories, clearCategories };
}
