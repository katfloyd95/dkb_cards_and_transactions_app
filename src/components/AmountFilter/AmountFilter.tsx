import styled from "styled-components";

interface AmountFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AmountFilter({ value, onChange }: AmountFilterProps) {
  return (
    <AmountFilterContainer>
      <AmountFilterLabel htmlFor="amount-filter">
        Amount filter
      </AmountFilterLabel>
      <AmountFilterInput
        id="amount-filter"
        type="number"
        placeholder="Minimum amount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step="0.01"
      />
    </AmountFilterContainer>
  );
}

const AmountFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
`;

const AmountFilterInput = styled.input`
  margin: 1rem;
  padding: 0.5rem;

  &:focus {
    outline: 2px solid #5c82d4;
    outline-offset: 2px;
  }
`;

const AmountFilterLabel = styled.label`
  text-align: left;
  margin: 0 1rem;
  padding: 0 0.5rem;
`;
