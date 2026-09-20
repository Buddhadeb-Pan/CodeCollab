const UserList = ({ users, currentUserId }) => {
  return (
    <div className="border border-line bg-bg-surface">
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <div className="font-mono text-xs text-muted tracking-wider">
          // online_users
        </div>
        <div className="font-mono text-xs text-green-400">
          ● {users.length}
        </div>
      </div>

      <div className="divide-y divide-line max-h-64 overflow-y-auto">
        {users.length === 0 ? (
          <div className="px-4 py-6 text-center font-mono text-xs text-muted">
            // waiting_for_users...
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="px-4 py-2.5 flex items-center gap-3 font-mono text-xs"
            >
              <div className="w-6 h-6 border border-line flex items-center justify-center text-amber text-[10px] font-bold">
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-cream truncate flex-1">
                {u.name}
              </span>
              {u.userId === currentUserId && (
                <span className="text-amber text-[10px]">(you)</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
