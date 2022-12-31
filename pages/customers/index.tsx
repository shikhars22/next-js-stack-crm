import axios from 'axios';
import {
	GetStaticProps,
	GetStaticPaths,
	GetServerSideProps,
	NextPage,
	InferGetStaticPropsType,
} from 'next';

type Customer = {
	id: number;
	name: string;
	industry: string;
};

type GetCustomerResponse = {
	customers: Customer[];
};

export const getStaticProps: GetStaticProps = async (context) => {
	const result = await axios.get<GetCustomerResponse>(
		'http://127.0.0.1:8000/api/customers/'
	);
	console.log('result....', result);

	return {
		props: {
			customers: result.data.customers,
		},
	};
};

const Customers: NextPage = ({
	customers,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	// console.log(customers);

	return (
		<>
			<h1>Here are the customers: </h1>
			{customers.map((customer: Customer) => {
				return (
					<div key={customer.id}>
						<p>{customer.name}</p>
						<p>{customer.industry}</p>
					</div>
				);
			})}
		</>
	);
};

export default Customers;
