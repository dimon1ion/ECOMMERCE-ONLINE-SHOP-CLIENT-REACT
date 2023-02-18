import Select from "react-select";
import s from "./Address.module.scss";
import validate from "../../../../assets/styles/inputValid.module.scss";
import { Button, Input } from "@nextui-org/react";
import { useContext, useEffect, useMemo, useState } from "react";
import request from "../../../../requests/request";
import ServerPath from "../../../../enums/ServerPath";
import AuthenticationContext from "../../../../contexts/Authentication.context";
import ErrorMessage from "../../../../ui/ErrorMessage";
import { toast } from "react-toastify";
import trashIcon from "../../../../assets/Images/trash_icon.svg";
import NotificationContext from "../../../../contexts/Notification.context";


export default function Address({
  addresses,
  setAddresses,
  idAddress,
  index,
  first,
  zip,
  selectedCity,
  cities,
}) {
  const emptyValidRegex = /.*\S.*/;

  const { isAuthenticated, getToken, checkAuthenticate, reloadToken } = useContext(
    AuthenticationContext
  );

  const { toastOptions } = useContext(NotificationContext);

  const [addressId, setAddressId] = useState(idAddress);
  const [address, setAddress] = useState(first);
  const [zipIndex, setZipIndex] = useState(zip);
  const [selectedCityId, setSelectedCityId] = useState(selectedCity);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorAddress, setIsErrorAddress] = useState(false);
  const [isErrorZip, setIsErrorZip] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setAddress(first);
  }, [first]);

  useEffect(() => {
    setZipIndex(zip);
  }, [zip]);

  useEffect(() => {
    setSelectedCityId(selectedCity?.value);
  }, [selectedCity]);

  const emptyCheck = (value) => {
    const isValid = value.match(emptyValidRegex);
    return {
      text: isValid
        ? ""
        : "Please enter the address of the place of receipt of the goods",
      color: isValid ? "primary" : "error",
      status: isValid ? "" : "error",
      isValid,
    };
  };

  const helperAddress = useMemo(() => {
    const res = emptyCheck(address);
    setIsErrorAddress(!res.isValid);
    return res;
  }, [address]);

  const helperZip = useMemo(() => {
    const res = emptyCheck(zipIndex);
    setIsErrorZip(!res.isValid);
    return res;
  }, [zipIndex]);

  const submitChanges = async (event) => {
    event.preventDefault();
    setIsError(false);
    const bodyData = {
      cityId: selectedCityId,
      first: address,
      second: null,
      zip: zipIndex,
    };
    console.log(bodyData);
    let response;
    if (addressId) {
      const url = new URL(ServerPath.SERVERPATH + ServerPath.PUTADDRESS);
      url.searchParams.append("addressId", addressId);
      response = await request(
        "PUT",
        url.toString(),
        bodyData,
        null,
        getToken()
      );
      if (response === null) {
        console.log("er1");
        setIsError(true);
        setErrorMessage("try later");
        return;
      } else if (response.status === 401) {
        await reloadToken();
        if (isAuthenticated === false) {
          throw "error";
        }
        submitChanges(event);
        return;
      } else if (response.status === 400) {
        console.log("er2");
        const data = await response.json();
        setIsError(true);
        setErrorMessage(data["error_message"] ?? "");
        return;
      }
    } else {
      response = await request(
        "POST",
        ServerPath.SERVERPATH + ServerPath.ADDADDRESS,
        bodyData,
        null,
        getToken()
      );
      if (response === null) {
        console.log("er1");
        setIsError(true);
        setErrorMessage("try later");
        return;
      } else if (response.status === 401) {
        await reloadToken();
        if (isAuthenticated === false) {
          throw "error";
        }
        submitChanges(event);
        return;
      } else if (response.status === 400) {
        console.log("er2");
        const data = await response.json();
        setIsError(true);
        setErrorMessage(data["error_message"] ?? "");
        return;
      }
    }

    const data = await response.json();
    setAddressId(data);
    console.log("complete");
  };

  const onChangeSelected = (newValue) => {
    setSelectedCityId(newValue?.value ?? null);
  };

  const deleteAddress = async () => {
    if (addresses.length < 1) {
      return;
    }
    console.log(index);
    const resultAddresses = [...addresses];
    console.log(resultAddresses);
    const [element] = resultAddresses.splice(index, 1);
    console.log(element);
    console.log(resultAddresses);
    if (element.id) {
      console.log("deleting");
      const response = await request(
        "DELETE",
        ServerPath.SERVERPATH + ServerPath.DELETEADDRESS + `/${element.id}`,
        null,
        null,
        getToken()
      );
      if (response === null || !response.ok) {
        throw "error";
      }
    }
    console.log("deleted");
    setAddresses(resultAddresses);

    // if (addresses.length < 1) {
    //   return;
    // }
    // const [element] = addresses.splice(index, 1);
    // console.log(element);
    // if (element.id) {
    //   console.log("zzzz");
    //   const response = await request(
    //     "DELETE",
    //     ServerPath.SERVERPATH + ServerPath.DELETEADDRESS + `/${element.id}`,
    //     null,
    //     null,
    //     getToken()
    //   );
    //   if (response === null || !response.ok) {
    //     return;
    //   }
    // }
    // const res = addresses.map((item) => item);
    // console.log("zzzz2");
    // console.log(res);
    // setAddresses(res);
  };

  return (
    <>
    <form onSubmit={(event) => {toast.promise(submitChanges(event), {
      pending: (addressId ? "Saving changes" : "Adding address"),
      success: (addressId ? "Changes has been saved" : "Address has been added"),
      error: "Error, please try again later"
    }, toastOptions)} }>
      <Select
        isMulti={false}
        isClearable={true}
        isSearchable={true}
        options={cities}
        defaultValue={selectedCity}
        placeholder="Select City"
        onChange={onChangeSelected}
        className={`my-1 ${validate["exception"]}`}
        isLoading={cities === undefined ? true : false}
      />
      <div className={s["input_address"]}>
        <Input
          clearable
          bordered
          initialValue={first}
          onChange={({ target: { value } }) => setAddress(value)}
          helperText={helperAddress.text}
          status={helperAddress.status}
          color={helperAddress.color}
          label="Address"
          placeholder="Street, house, flat"
          width={"100%"}
        />
      </div>
      <div className={s["input_address"]}>
        <Input
          clearable
          bordered
          initialValue={zip}
          onChange={({ target: { value } }) => setZipIndex(value)}
          helperText={helperZip.text}
          status={helperZip.status}
          color={helperZip.color}
          label="Mail index"
          placeholder="Enter mail index"
          width={"100%"}
        />
      </div>
      <div className="d-flex flex-column flex-sm-row">
        <Button
          bordered
          type="submit"
          color={addressId ? "secondary" : "warning"}
          disabled={isErrorAddress || !selectedCityId || isErrorZip || !((address !== first) || (zipIndex !== zip) || (selectedCityId !== selectedCity?.value))}
        >
          {addressId ? "Save changes" : "Add address"}
        </Button>
        <Button
          color={"error"}
          onPress={() => {
            toast.promise(deleteAddress, {
                pending: "Deleting Address",
                error: "Error",
                success: "Address has been removed"
            }, toastOptions);
          }}
          icon={<img src={trashIcon} alt="" className={s["icon_image"]} />}
          bordered
          className={s["button_delete"]}
          auto
        ></Button>
        <div className="d-flex align-items-center">
          <ErrorMessage show={!isError}>{errorMessage}</ErrorMessage>
        </div>
      </div>
      </form>
    </>
  );
}
