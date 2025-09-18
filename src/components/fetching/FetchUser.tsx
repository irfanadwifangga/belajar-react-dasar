import { useEffect, useState } from 'react';
import { Users, Search, Filter, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
	id: number;
	firstName: string;
	lastName: string;
	age: number;
}

export default function FetchUser() {
	const [currentPage, setCurrentPage] = useState(1);
	const usersPerPage = 10;
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | undefined>();
	const [searchTerm, setSearchTerm] = useState('');

	const filteredUsers = users.filter((user) =>
		`${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Pagination logic
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
	const paginatedUsers = filteredUsers.slice(
		(currentPage - 1) * usersPerPage,
		currentPage * usersPerPage
	);

	const fetchUserData = async () => {
		try {
			const response = await fetch('https://dummyjson.com/users');
			const data: { users: User[] } = await response.json();

			console.log(data.users);
			setUsers(data.users);
		} catch (error) {
			setError((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUserData();
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
					<p className="text-xl text-gray-700 font-medium">Loading users...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
				<div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<span className="text-red-500 text-2xl">⚠</span>
					</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
					<p className="text-red-600 text-lg">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
			<div className="container mx-auto max-w-4xl">
				{/* Header Section */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
						<Users className="w-10 h-10 text-white" />
					</div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
						User Directory
					</h1>
					<p className="text-gray-600 text-lg">Manage and explore your user community</p>
				</div>

				{/* Search Bar */}
				<div className="mb-8">
					<div className="relative max-w-md mx-auto">
						<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search users..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white shadow-sm"
						/>
					</div>
				</div>

				{/* Stats Card */}
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600">
								{filteredUsers.length}
							</div>
							<div className="text-gray-600">Total Users</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-indigo-600">
								{Math.round(
									filteredUsers.reduce((sum, user) => sum + user.age, 0) /
										filteredUsers.length
								) || 0}
							</div>
							<div className="text-gray-600">Average Age</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-purple-600">
								{Math.max(...filteredUsers.map((user) => user.age), 0)}
							</div>
							<div className="text-gray-600">Oldest User</div>
						</div>
					</div>
				</div>

				{/* User List */}
				<div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
					<div className="p-6 border-b border-gray-100">
						<h2 className="text-xl font-semibold text-gray-800 flex items-center">
							<Filter className="w-5 h-5 mr-2" />
							Users ({filteredUsers.length})
						</h2>
					</div>

					{paginatedUsers.length === 0 ? (
						<div className="p-12 text-center">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<User className="w-8 h-8 text-gray-400" />
							</div>
							<p className="text-gray-500 text-lg">No users found</p>
							<p className="text-gray-400">Try adjusting your search criteria</p>
						</div>
					) : (
						<div className="divide-y divide-gray-100">
							{paginatedUsers.map((user, index) => (
								<div
									key={user.id}
									className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer group"
									style={{ animationDelay: `${index * 100}ms` }}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow">
												{user.firstName[0]}
												{user.lastName[0]}
											</div>
											<div>
												<h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
													{user.firstName} {user.lastName}
												</h3>
												<p className="text-gray-600">
													Age: {user.age} years old
												</p>
											</div>
										</div>
										<div className="opacity-0 group-hover:opacity-100 transition-opacity">
											<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-md">
												View Profile
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="text-center mt-8 text-gray-500">
					<p>
						Showing {paginatedUsers.length} of {filteredUsers.length} users (Total:{' '}
						{users.length})
					</p>
					{/* Pagination Controls */}
					{totalPages > 1 && (
						<div className="flex justify-center items-center gap-2 mt-4">
							<button
								className={`px-4 py-3 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500 ${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} hover:bg-blue-600 transition-colors`}
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="w-4 h-4 text-white" />
							</button>
							{[...Array(totalPages)].map((_, idx) => (
								<button
									key={idx}
									className={`px-4 py-3 rounded ${currentPage === idx + 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'} font-semibold cursor-pointer hover:bg-indigo-500 hover:text-white transition-colors`}
									onClick={() => setCurrentPage(idx + 1)}
								>
									{idx + 1}
								</button>
							))}
							<button
								className={`px-4 py-3 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500 ${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} hover:bg-blue-600 transition-colors`}
								onClick={() =>
									setCurrentPage((prev) => Math.min(prev + 1, totalPages))
								}
								disabled={currentPage === totalPages}
							>
								<ChevronRight className="w-4 h-4 text-white" />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
