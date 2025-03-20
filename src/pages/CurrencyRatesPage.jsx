import CurrencyRates from "../components/CurrencyRates";
import PageWrapper from "../components/PageWrapper";

export default function CurrencyRatesPage() {
  return (
    <PageWrapper title="Текущие курсы валют">
      <CurrencyRates />
    </PageWrapper>
  );
}
