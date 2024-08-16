import { useEffect, useState } from 'react'
import ProjectView from '../../../../../components/arcade/showcase/project-view'
import Nav from '../../../../../components/Nav'
import Footer from '../../../../../components/arcade/Footer'

const ProjectShowPage = ({projectID}) => {

  const Loading = () => (<div>Loading...</div>)

  const ErrorMessage = () => (<div>There was an error loading your projects.</div>)

  console.log("projectID", projectID);
  const [project, setProject] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMsg, setError] = useState(null)

  useEffect(async () => {
    const token = window.localStorage.getItem('arcade.authToken')
    const response = await fetch(`/api/arcade/showcase/projects/${projectID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(e => {
      console.error(e)
      setStatus('error')
      setError(e)
    })
    const data = await response.json()
    if (data.error) {
      setStatus('error')
      return
    } else {
      setProject(data.project)
      setStatus('success')
    }

  }, [])

  return (
    <div>
      <Nav />
      {
        status == 'loading' && <Loading />
      }

      {
        status == 'error' && <ErrorMessage />
      }

      {
        status == 'success' && 
        <ProjectView
          key={project.id}
          id={project.id}
          title={project.title}
          desc={project.desc}
          slack={project.slackLink}
          codeLink={project.codeLink}
          playLink={project.playLink}
          images={project.images}
          githubProf={project.githubProf}
        />
      }
      <Footer />
    </div>
  )
}

export default ProjectShowPage

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}
export async function getStaticProps({params}) {
  const { projectID } = params

  return { props: { projectID } }
}
