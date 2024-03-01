import styled from "styled-components";

export const StyledItem = styled.li`
    display: flex;
    align-items: center;
    padding-bottom: 5px;
  `;

export const StyledColumn = styled.span<{ width: string }>`
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  
    a {
      color: inherit;
    }
  
    width: ${props => props.width};
  `;

const StyledButton = styled.button`
    background: transparent;
    border: 1px solid #171212;
    padding: 5px;
    cursor: pointer;
  
    transition: all 0.1s ease-in;
  
    &:hover {
      background: #171212;
      color: #ffffff;
    }
  `;

export const StyledButtonSmall = styled(StyledButton)`
    padding: 5px;
  `;
