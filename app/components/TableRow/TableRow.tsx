import { useCallback, useState } from "react";
import { Box, Button, IndexTable, Link, TextField } from "@shopify/polaris"
import type { RowProps } from "@shopify/polaris/build/ts/src/components/IndexTable";

import styles from './TableRow.module.css';

interface ITableRowProps extends Omit<RowProps, 'children'> {
  productTitle: string;
}

function TableRow({ productTitle, ...restProps }: ITableRowProps) {
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');

  const handleChangeMinValue = useCallback((minValue: string) => setMinValue(minValue), []);

  const handleChangeMaxValue = useCallback((maxValue: string) => setMaxValue(maxValue), []);

  return (
    <IndexTable.Row
      {...restProps}
    >
      <IndexTable.Cell className={styles.productCell}>
        <Link url="#">{productTitle}</Link>
      </IndexTable.Cell>
      <IndexTable.Cell className={styles.valueCell}>
        <Box width="50%">
          <TextField
            label="Min value"
            labelHidden
            value={minValue}
            onChange={handleChangeMinValue}
            autoComplete="off"
            disabled
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
            disabled
          />
        </Box>
      </IndexTable.Cell>
      <IndexTable.Cell className={styles.actionCell}>
        <Button onClick={() => console.log('click')}>Edit</Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  )
}

export default TableRow