import CurrencyRates from "../components/CurrencyRates.tsx";
import PageWrapper from "../components/PageWrapper.tsx";

export default function CurrencyRatesPage() {
  return (
    <PageWrapper title="Текущие курсы валют">
      <CurrencyRates />
    </PageWrapper>
  );
}
