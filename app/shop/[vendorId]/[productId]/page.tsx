import { VENDORS } from "@/app/shop/constants";
import ProductRoute from "./ProductRoute";

export function generateStaticParams() {
  const params: { vendorId: string; productId: string }[] = [];
  Object.entries(VENDORS as Record<string, any>).forEach(([vendorId, vendor]) => {
    (vendor.products ?? []).forEach((p: any) => {
      params.push({ vendorId, productId: String(p.id) });
    });
  });
  return params;
}

export default function Page({ params }: { params: { vendorId: string; productId: string } }) {
  return <ProductRoute params={params} />;
}