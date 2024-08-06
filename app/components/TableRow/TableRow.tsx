import { useCallback, useState } from "react";
import { Box, Button, IndexTable, InlineStack, Link, TextField } from "@shopify/polaris"
import { XCircleIcon } from "@shopify/polaris-icons"
import type { RowProps } from "@shopify/polaris/build/ts/src/components/IndexTable";

import styles from './TableRow.module.css';

interface ITableRowProps extends Omit<RowProps, 'children'> {
  id: string,
  productTitle: string;
  productLink: string;
  minLimit?: string;
  maxLimit?: string;
  onChangeLimits: (id: string, minLimit: number, maxLimit: number) => void;
}

function TableRow({ id, productTitle, productLink, minLimit, maxLimit, onChangeLimits, ...restProps }: ITableRowProps) {
  const [minValue, setMinValue] = useState<string>(minLimit || '');
  const [maxValue, setMaxValue] = useState<string>(maxLimit || '');
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const handleChangeMinValue = useCallback((minValue: string) => setMinValue(minValue), []);

  const handleChangeMaxValue = useCallback((maxValue: string) => setMaxValue(maxValue), []);

  const handleEditBtnClick = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditable(true)
  }, []);

  const handleCloseBtnClick = useCallback(() => {
    setIsEditable(false);
    setMinValue(minLimit || '');
    setMaxValue(maxLimit || '');
  }, [minLimit, maxLimit]);

  const handleSaveBtnClick = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('save');
    onChangeLimits(123, Number(minValue), Number(maxValue));
  }, []);

  return (
    <IndexTable.Row
      id={id}
      {...restProps}
    >
      <IndexTable.Cell className={styles.productCell}>
        <Link
          url={productLink}
          target="_blank"
        >
          {productTitle}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell className={styles.valueCell}>
        <Box width="50%">
          <TextField
            label="Min value"
            labelHidden
            value={minValue}
            onChange={handleChangeMinValue}
            autoComplete="off"
            disabled={!isEditable}
          />
        </Box>
      </IndexTable.Cell>
      <IndexTable.Cell className={styles.valueCell}>
        <Box width="50%">
          <TextField
            label="Max value"
            labelHidden
            value={maxValue}
            onChange={handleChangeMaxValue}
            autoComplete="off"
            disabled={!isEditable}
          />
        </Box>
      </IndexTable.Cell>
      <IndexTable.Cell className={styles.actionCell}>
        {isEditable ?
          <InlineStack blockAlign="center" align="start" gap="200">
            <Button onPointerDown={handleSaveBtnClick}>Save</Button>
            <Button icon={XCircleIcon} onPointerDown={handleCloseBtnClick} />
          </InlineStack>
          :
          <Button onPointerDown={handleEditBtnClick}>Edit</Button>
        }
      </IndexTable.Cell>
    </IndexTable.Row>
  )
}

export default TableRow