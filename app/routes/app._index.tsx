import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
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
} from "@shopify/polaris";
import TableRow from "~/components/TableRow/TableRow";
import { createProductLimit, getAllProductLimits, updateProductLimit, validateProductLimitPayload } from "~/models/ProductLimit.server";
import { authenticate } from "~/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return await getAllProductLimits();
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const data: Record<string, string | number> = {
    ...Object.fromEntries(await request.formData()),
    shop,
  };

  console.log(data);

  try {
    const { id, productId, title, productHandle, shop, minLimit, maxLimit } = validateProductLimitPayload(data);

    const actions: Record<string, () => void> = {
      POST: () => createProductLimit({ productId, title, productHandle, shop }),
      PATCH: () => {
        if (!id) {
          throw new Error('id should be provided');
        }

        updateProductLimit({ id, minLimit, maxLimit })
      }
    }

    return actions[request.method]();
  } catch (error) {
    const errors = JSON.parse((error as Error).message);
    return json({ errors }, { status: 422 });
  }
}

export default function Index() {
  const productLimitArray = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>()?.errors;
  const submit = useSubmit();

  console.log(errors);

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

  const handleAddProductClick = async () => {
    const products = await window.shopify.resourcePicker({
      type: 'product',
      action: 'select',
    })

    if (products) {
      const { id, title, handle } = products[0];

      submit({ productId: id, title, productHandle: handle }, { method: 'post' });
    }
  }

  const handleUpdateProductLimit = (id: string, minLimit: number, maxLimit: number) => {
    submit({ id, minLimit, maxLimit }, { method: 'patch' })
  }

  const rowMarkup2 = productLimitArray.map(({ id, title, productHandle, shop, minLimit, maxLimit }, index) => (
    <TableRow
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
      productTitle={title}
      productLink={`https://${shop}/products/${productHandle}`}
      minLimit={minLimit?.toString()}
      maxLimit={maxLimit?.toString()}
      onChangeLimits={handleUpdateProductLimit}
    />
  ))

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
                selectable={false}
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
