import React, { useEffect, useState } from 'react';

type Rating = {
  name: string;
  email: string;
  'star rating': number;
  'review': string;
};

type User = {
  name: string;
  email: string;
  phone: string;
};
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export function AdminPanel() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch ratings
      const ratingSnap = await getDocs(collection(db, 'rating'));
  const ratingData = ratingSnap.docs.map(doc => doc.data() as Rating);
  setRatings(ratingData);
      // Fetch users
      const userSnap = await getDocs(collection(db, 'users'));
  const userData = userSnap.docs.map(doc => doc.data() as User);
  setUsers(userData);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">User Logins</h2>
            <table className="w-full border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Phone</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Reviews & Ratings</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Star Rating</th>
                  <th className="p-2">Review</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.email}</td>
                    <td className="p-2">{r['star rating']}</td>
                    <td className="p-2">{r['review']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
