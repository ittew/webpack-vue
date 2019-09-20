import { updateMemberName } from '../getData'
import Vue from 'vue'
export const updateName = ({commit}, value) => {
  commit('modifyName', value)
}
export const editGroup = ({commit}, obj) => {
  commit('EDIT_GROUP', obj)
}
export const editMember = async({commit}, value) => {
  commit('EDIT_MEMBER', value)
}

export const storeGroupId = ({commit}, value) => {
  commit('STORE_GROUPID', value)
}
