export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details key={item.q} className="faq-item" open={i === 0}>
          <summary>{item.q}</summary>
          <div className="faq-item-body">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
