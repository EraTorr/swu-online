export default function Home(props: { version: number }) {
  return (
    <>
      <div class="container">
        <div class="title">AdonisJS {props.version} x Inertia x Solid.js</div>

        <span>
          <a href="/pregame">Game</a>
          <br />
          <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS docmentation</a>.
        </span>
      </div>
    </>
  )
}
