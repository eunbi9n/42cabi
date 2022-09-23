import styled from "@emotion/styled";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background-color: transparent;
  color: ${(props): string => (props.color ? props.color : "black")};
`;

interface SectionButtonProps {
  index: number;
  isClicked: boolean;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}

// TODO: hybae
// handler 내 로직 추가 필요

const nonClickedColor = "#c0c0c0";
const clickedColor = "#6767aa";

const SectionButton = (props: SectionButtonProps): JSX.Element => {
  const { index, isClicked, setCurrentSlide } = props;

  const clickHandler = (): void => {
    setCurrentSlide(index);
  };

  return (
    <Button
      onClick={clickHandler}
      color={isClicked ? clickedColor : nonClickedColor}
    >
      <FontAwesomeIcon icon={faMinus} />
    </Button>
  );
};

export default SectionButton;
