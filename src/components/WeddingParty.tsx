const partyMembers = [
  {
    name: "Jane Doe",
    role: "Maid of Honor",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "John Smith",
    role: "Best Man",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Emily Brown",
    role: "Bridesmaid",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Michael Johnson",
    role: "Groomsman",
    image: "/placeholder.svg?height=200&width=200",
  },
  // Add more party members as needed
];

export function WeddingParty() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {partyMembers.map((member, index) => (
        <div key={index} className="text-center">
          <img
            src={member.image}
            alt={member.name}
            className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
          />
          <h3 className="font-semibold text-lg text-sage-800">{member.name}</h3>
          <p className="text-sage-600">{member.role}</p>
        </div>
      ))}
    </div>
  );
}
