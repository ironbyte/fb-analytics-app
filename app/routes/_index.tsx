import { type MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: "Moncy's FB Analytics App" },
    { name: 'description', content: "Moncy's FB Analytics App" },
  ];
};

export default function Index() {
  return (
    <div className="flex justify-center">
      <h1 className="text-2xl font-semibold text-violet-800  md:text-4xl">
        Welcome to Moncy's FB Analytics App
      </h1>
    </div>
  );
}
