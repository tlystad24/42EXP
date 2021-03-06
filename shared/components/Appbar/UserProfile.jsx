import React, { Component } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Auth from '../Auth';
import PropTypes from 'prop-types';

class ProfileMenu extends Component{
  constructor(props){
    super(props);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentWillMount(){
    // check if click happens in profile menu or outside of it
    // http://stackoverflow.com/questions/23821768/how-to-listen-for-click-events-that-are-outside-of-a-component
    // if statement because server cant recognize document
    if(typeof window !== 'undefined'){
      document.addEventListener('click',this.handleOutsideClick,false)
    }
  }

  handleOutsideClick(e){
    // if click happens outside of profile-menu, hide profile-menu
    if(!ReactDOM.findDOMNode(this).contains(e.target)){
      this.props.toggleProfileMenu()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  render(){
    return (
      <div tabIndex="1" onClick={this.props.toggleProfileMenu} ref={(profile_menu) => {this.profile_menu = profile_menu}} className={`profile_menu profile_menu--${this.props.isProfileMenuOpen ? "visible" : "hidden"}`}>
        <Link to={`/user/${this.props.User.username}`}><button className="profile_menu__item"><span className="ion-person"/>Profile</button></Link>
        <Link to="/about"><button className="profile_menu__item"><span className="ion-information-circled"/>About</button></Link>
        <a href="/logout"><button className="profile_menu__item"><span className="ion-reply"/>Logout</button></a>
      </div>
    )
  }
}

ProfileMenu.PropTypes = {
  toggleProfileMenu: PropTypes.func.isRequired,
  isProfileMenuOpen: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  User: PropTypes.object.isRequired,
}

class UserProfile extends Component{
  constructor(props){
    super(props);
    this.state = {
      isProfileMenuOpen: false,
      modalIsOpen: false,
      register: false,
      login: false
    }
    this.authButtons = this.authButtons.bind(this);
    this.toggleProfileMenu = this.toggleProfileMenu.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  authButtons(){
    if(process.env.NODE_ENV === 'production'){
      return (
        <div className="auth">
          <a href= "/auth/github"><button className="login_github"> Register With Github</button></a>
        </div>
      )
    } else {
      return (
        <div className="auth">
          <button name="register" className="register" onClick={this.openModal.bind(this,"register")}> Register </button>
          <button name="login" className="login" onClick={this.openModal.bind(this,"login")}> Login </button>
        </div>
      )
    }
  }

  openModal(type){
    this.setState({ modalIsOpen: true, [type]:true })
  }

  closeModal(){
    this.setState({ modalIsOpen: false, register: false, login: false })
  }

  toggleProfileMenu(){
    this.setState({ isProfileMenuOpen: !this.state.isProfileMenuOpen })
  }

  render(){
    return (
        <div>
          {
            !this.props.isAuthenticated
            ?
            this.authButtons()
            :
            <div className="auth">
              <button className="auth__profile_icon" onClick={this.toggleProfileMenu}>
                <img src={`https://avatars1.githubusercontent.com/${this.props.User.username}` } />
              </button>
              {
                this.state.isProfileMenuOpen
                ?
                <ProfileMenu toggleProfileMenu={this.toggleProfileMenu} isProfileMenuOpen={this.state.isProfileMenuOpen} {...this.props}/>
                :
                null
              }
            </div>
          }

          <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className="content-auth" overlayClassName="overlay-auth">
              {
                !this.state.register
                  ?
                  <Auth url={'/auth/login'}/>
                  :
                  <Auth url={'/auth/register'}/>
              }
          </Modal>

        </div>
    )
  }
}

UserProfile.PropTypes = {
  User: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
}

export default UserProfile;
