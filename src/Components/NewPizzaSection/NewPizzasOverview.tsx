import EntryOverview from "../EntryOverview";

export default function NewPizzasOverview() {
  return (
    <EntryOverview
      collectionName="pizza-collection"
      kind="pizza"
      title="Recently added pizzas"
      recentOnly
    />
  );
}
