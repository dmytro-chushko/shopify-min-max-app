import type { ActionFunctionArgs } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Divider,
  Box,
  IndexTable,
  useIndexResourceState,
  Link,
  TextField
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import TableRow from "~/components/TableRow/TableRow";
import { authenticate } from "~/shopify.server";

type productLimitPayload = {
  id?: string;
  productId: string;
  title: string;
  shop: string;
  minLimit?: number;
  maxLimit?: number;
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const payload = await request.formData();
  const createPayload
  console.log(request);

  return null;
}

export default function Index() {
  const submit = useSubmit();

  const productLimitList = [
    {
      id: '1',
      title: 'Product Name'
    }
  ];
  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(productLimitList);

  const rowMarkup2 = productLimitList.map(({ id, title }, index) => (
    <TableRow
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
      productTitle={title}
    />
  ))

  const handleAddProductClick = async () => {
    const products = await window.shopify.resourcePicker({
      type: 'product',
      action: 'select',
    })

    if (products) {
      const { id, title } = products[0];

      submit({ id, title }, { method: 'post' });
    }
  }



  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingSm">What are Product Limits?</Text>
              <Text as="p" variant="bodyMd">Product limits are the minimum quantity for individual product/variant items that your customers may add to their cart. You have two mathods to define product limits for each individual item you offer: Add a product or SKU (variant) from a databse of your offerings or batch upload by CSV. Please find the buttons located at bottom of this page to perform the list updating of your choice. If you offer an item that is available in different variants (i.e. widgets in blue, red, and green), you can check the "Combine Variants" box to apply limits accros all the individual item variants</Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack blockAlign="center" align="space-between">
                <Button onClick={handleAddProductClick}>Add product</Button>
                <Button disabled>Delete</Button>
              </InlineStack>
              <Divider borderColor="border" />
              <Box>
                <Text as="h2" variant="headingSm">Search</Text>
              </Box>
              <IndexTable
                resourceName={resourceName}
                itemCount={productLimitList.length}
                selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: 'Product' },
                  { title: 'Min' },
                  { title: 'Max' },
                  { title: 'Actions' },
                ]}
              >
                {rowMarkup2}
                {/* {rowMarkup} */}
              </IndexTable>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>

    </Page>
  );
}
