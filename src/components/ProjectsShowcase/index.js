import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectList: [],
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    const {activeCategoryId} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const projectsData = fetchedData.projects
      const updatedData = projectsData.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        projectList: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeCategory = event => {
    this.setState({activeCategoryId: event.target.value}, this.getProjectsData)
  }

  renderProjectListSuccessView = () => {
    const {projectList} = this.state
    return (
      <ul className="project-list-container">
        {projectList.map(eachProject => (
          <li key={eachProject.id} className="project-item-container">
            <img src={eachProject.imageUrl} alt={eachProject.name} />
            <p>{eachProject.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  clickRetryBtn = () => {
    this.getProjectsData()
  }

  renderProjectListFailureView = () => {
    return (
      <div className="failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button type="button" onClick={this.clickRetryBtn}>
          Retry
        </button>
      </div>
    )
  }

  renderLoadingView = () => {
    return (
      <div data-testid="loader" className="products-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    )
  }

  renderProjectListContainer = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectListSuccessView()
      case apiStatusConstants.failure:
        return this.renderProjectListFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state
    return (
      <>
        <nav className="nav-header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="main-container">
          <select value={activeCategoryId} onChange={this.changeCategory}>
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectListContainer()}
        </div>
      </>
    )
  }
}

export default ProjectsShowcase
