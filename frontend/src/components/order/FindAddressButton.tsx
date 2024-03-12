import { useDaumPostcodePopup } from "react-daum-postcode";
import styled from "styled-components";
import Button from "../common/Button";

interface Props {
  onCompleted: (address: string) => void;
}

const SCRIPT_URL =
  "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

const FindAddressButton = ({ onCompleted }: Props): JSX.Element => {
  const open = useDaumPostcodePopup(SCRIPT_URL);

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    onCompleted(fullAddress);
  };

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    open({ onComplete: handleComplete });
  };

  return (
    <Button type="button" size="medium" scheme="normal" onClick={handleClick}>
      주소 찾기
    </Button>
  );
};

const FindAddressButtonStyle = styled(Button)``;

export default FindAddressButton;
