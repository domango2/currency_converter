import CurrencyConverter from "../components/CurrencyConverter.tsx";
import PageWrapper from "../components/PageWrapper.tsx";

export default function ConverterPage() {
  return (
    <PageWrapper title="Конвертер валют">
      <CurrencyConverter />
    </PageWrapper>
  );
}
