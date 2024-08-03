import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack
} from "@shopify/polaris";



export default function Index() {
  

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
      </Layout>
      
    </Page>
  );
}
