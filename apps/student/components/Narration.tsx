"use client"
type Props = { avatar: string; name: string; children: React.ReactNode }

export function Narration({ avatar, name, children }: Props) {
  return (
    <div className="narration">
      <div className="avatar"><img src={avatar} alt={name} width={40} height={40} /></div>
      <div className="bubble">
        <strong>{name}：</strong>
        <div className="typewriter" key={String(children)}>
          {children}
        </div>
      </div>
    </div>
  )
}